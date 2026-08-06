// app/features/campaign/IntroVideoPopup.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, X } from 'lucide-react';

/**
 * ป๊อปอัปวิดีโอที่เด้งขึ้นมาตอนเปิดหน้าแรก
 * - กรอบ 16:9 เต็มความกว้างที่มี ย่อขยายตามจอ
 * - ปิดได้ด้วยปุ่ม X, กด Escape หรือคลิกพื้นหลัง
 * - จำว่าเคยดูแล้วใน sessionStorage จึงไม่เด้งซ้ำระหว่างเดินดูหน้าอื่นแล้วกลับมา
 *   (เปิดเว็บใหม่อีกรอบถึงจะเด้งอีกครั้ง - ดูหมายเหตุที่ STORAGE_KEY)
 * - player ถูก destroy ตอนปิด เสียงจึงหยุดจริง ไม่เล่นค้างอยู่เบื้องหลัง
 * - เข้าถึงได้: โฟกัสวิ่งวนอยู่ในกล่อง, คืนโฟกัสให้จุดเดิมตอนปิด, ล็อกการเลื่อนหน้า
 *
 * เรื่องเสียง: เบราว์เซอร์ทุกเจ้าบล็อก autoplay ที่ไม่ mute ถ้าผู้ใช้ยังไม่เคยมีปฏิสัมพันธ์กับเว็บ
 * และถ้าเริ่มเล่นแบบมีเสียงแล้วโดนบล็อก วิดีโอจะ "ค้างไม่เล่นเลย" ซึ่งแย่กว่าไม่มีเสียง
 * ลำดับที่ใช้จึงเป็น: เริ่ม mute (รับประกันว่าภาพเดิน) -> ลองเปิดเสียง -> ตรวจว่าได้จริงไหม
 * ถ้าไม่ได้ก็ mute กลับพร้อมขึ้นปุ่ม "แตะเพื่อเปิดเสียง" ให้กดทีเดียว
 */

const YOUTUBE_ID = 'pBDwWlakrow';

// sessionStorage = เด้งครั้งเดียวต่อการเปิดเว็บหนึ่งรอบ
// ถ้าอยากให้เด้งครั้งเดียวถาวร เปลี่ยนเป็น window.localStorage
// ถ้าอยากให้เด้งทุกครั้งที่เข้าหน้าแรก ลบการเช็ค/เขียน STORAGE_KEY ออก
const STORAGE_KEY = 'sdn:intro-video-seen';

// หน่วงเล็กน้อยให้หน้าเว็บวาดเสร็จก่อน จะได้ไม่กระชากตอนเข้าเว็บ
const OPEN_DELAY_MS = 700;

// รอให้ player เริ่มเล่น (แบบ mute) นิ่งก่อน แล้วค่อยลองเปิดเสียง
const UNMUTE_ATTEMPT_MS = 600;
// หลังลองเปิดเสียงแล้ว รอเท่านี้ค่อยตรวจว่าได้เสียงจริงหรือโดนบล็อก
const UNMUTE_VERIFY_MS = 900;

const YT_API_SCRIPT_ID = 'youtube-iframe-api';
const PLAYER_MOUNT_ID = 'sdn-intro-video-player';

// typing เท่าที่ใช้จริงของ YouTube IFrame Player API
interface YTPlayer {
  playVideo(): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getPlayerState(): number;
  destroy(): void;
}

interface YTNamespace {
  Player: new (elementId: string, options: Record<string, unknown>) => YTPlayer;
  PlayerState: { PLAYING: number };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// โหลดสคริปต์ YouTube API ครั้งเดียว แล้วแชร์ promise เดิมให้ทุกคนที่เรียกซ้ำ
let ytApiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<YTNamespace>(resolve => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT as YTNamespace);
    };

    if (!document.getElementById(YT_API_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = YT_API_SCRIPT_ID;
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  });

  return ytApiPromise;
}

export default function IntroVideoPopup() {
  const [open, setOpen] = useState(false);
  // true เมื่อเบราว์เซอร์ไม่ยอมให้เล่นพร้อมเสียง จึงต้องให้ผู้ใช้แตะเปิดเสียงเอง
  const [needsUnmute, setNeedsUnmute] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  // จำ element ที่โฟกัสอยู่ก่อนเปิด เพื่อคืนโฟกัสให้ตอนปิด
  const lastFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY) === '1') return;

    const t = window.setTimeout(() => {
      lastFocusedRef.current = document.activeElement;
      setOpen(true);
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(t);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setNeedsUnmute(false);
    window.sessionStorage.setItem(STORAGE_KEY, '1');

    // คืนโฟกัสให้จุดเดิม ไม่ให้โฟกัสหล่นไปอยู่ที่ body
    const previous = lastFocusedRef.current;
    if (previous instanceof HTMLElement) previous.focus();
  }, []);

  // สร้าง player ตอนเปิด และทำลายทิ้งตอนปิด (เสียงจะได้หยุดจริง)
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const timers: number[] = [];

    loadYouTubeApi().then(YT => {
      if (cancelled || !document.getElementById(PLAYER_MOUNT_ID)) return;

      playerRef.current = new YT.Player(PLAYER_MOUNT_ID, {
        videoId: YOUTUBE_ID,
        // โดเมน nocookie: YouTube จะไม่ตั้ง cookie ติดตามก่อนผู้ใช้กดเล่น
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1,
          // เริ่มแบบ mute เสมอ เพราะเป็นเงื่อนไขเดียวที่เบราว์เซอร์รับประกันว่าจะเล่นให้
          // ถ้าเริ่มแบบมีเสียงแล้วโดนบล็อก วิดีโอจะค้างไม่เล่นเลย ซึ่งแย่กว่าไม่มีเสียง
          mute: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            if (cancelled) return;
            event.target.playVideo();

            // ภาพเดินแล้ว ค่อยลองเปิดเสียง - สำเร็จในเบราว์เซอร์ที่ให้สิทธิ์เว็บนี้ไว้
            timers.push(window.setTimeout(() => {
              const player = playerRef.current;
              if (cancelled || !player) return;

              player.unMute();
              player.setVolume(100);

              // ตรวจผลจริง ไม่เชื่อว่าสั่งแล้วได้ - เบราว์เซอร์อาจ mute กลับหรือสั่งหยุดเล่น
              timers.push(window.setTimeout(() => {
                const p = playerRef.current;
                if (cancelled || !p) return;

                const blocked = p.isMuted() || p.getPlayerState() !== YT.PlayerState.PLAYING;
                if (blocked) {
                  // กลับไป mute ให้ภาพเดินต่อ แล้วให้ผู้ใช้แตะเปิดเสียงเอง
                  p.mute();
                  p.playVideo();
                  setNeedsUnmute(true);
                }
              }, UNMUTE_VERIFY_MS));
            }, UNMUTE_ATTEMPT_MS));
          }
        }
      });
    });

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [open]);

  const unmute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    // ตอนนี้มี user gesture แล้ว เบราว์เซอร์จึงยอมให้มีเสียง
    player.unMute();
    player.setVolume(100);
    player.playVideo();
    setNeedsUnmute(false);
  }, []);

  // ล็อกการเลื่อนหน้าเบื้องหลังระหว่างเปิดอยู่
  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape ปิด และกัน Tab หลุดออกไปนอกกล่อง
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, iframe, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // โฟกัสไปที่ปุ่มปิดทันทีที่เปิด ผู้ใช้คีย์บอร์ดจะได้ออกได้ทันที
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro-video-backdrop"
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs print:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="วิดีโอแนะนำ SDN Thailand"
            className="relative w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            // คลิกในกล่องต้องไม่ทะลุไปโดน backdrop จนปิดเอง
            onClick={e => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="ปิดวิดีโอ"
              className="absolute -top-11 right-0 z-10 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/30 transition-colors hover:bg-white/20 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff7834] sm:-right-2"
            >
              <X className="h-5 w-5" />
            </button>

            {/* กรอบ 16:9 */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
              {/* YT.Player จะแทนที่ div นี้ด้วย iframe ของมันเอง */}
              <div id={PLAYER_MOUNT_ID} className="h-full w-full" />

              {/* ขึ้นเฉพาะตอนที่เบราว์เซอร์บล็อกเสียง - แตะครั้งเดียวได้ยินเสียง */}
              <AnimatePresence>
                {needsUnmute && (
                  <motion.button
                    type="button"
                    onClick={unmute}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    // ต้องมี z-index ไม่งั้น iframe ของ YouTube ทับปุ่ม แล้วคลิกทะลุไปโดนลิงก์ในตัวเล่นแทน
                    className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#ff7834] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#e86b2a] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    แตะเพื่อเปิดเสียง
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
