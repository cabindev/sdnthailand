# Security Measures - SDN Thailand

## File Upload Security

### Contact Form Upload Protection

1. **Rate Limiting**
   - 3 requests per minute per IP address
   - Prevents spam and DoS attacks

2. **File Validation**
   - MIME type verification
   - File extension whitelist (pdf, jpg, jpeg, png, gif)
   - Double extension detection (e.g., file.php.jpg)
   - Dangerous extension blacklist
   - File size limit: 10MB

3. **Directory Protection**
   - `.htaccess` prevents PHP execution in uploads folder
   - Directory browsing disabled
   - Script execution disabled

4. **Input Sanitization**
   - Remove `<>` characters from all inputs
   - Length limits on all fields
   - Email format validation
   - Filename sanitization

## Dangerous File Extensions Blocked

```
php, php3, php4, php5, phtml, exe, sh, bat, cmd, com,
pif, scr, vbs, js, jar
```

## Allowed File Types (Contact Form)

- PDF documents (.pdf)
- JPEG images (.jpg, .jpeg)
- PNG images (.png)
- GIF images (.gif)

## Security Headers (Recommended for Production)

Add these to your web server configuration:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Regular Security Checks

1. Monitor upload directories for suspicious files
2. Review server logs for unusual activity
3. Keep dependencies updated
4. Use environment variables for sensitive data
5. Never commit `.env` files to git

## Incident Response

If you suspect a security breach:

1. Immediately check for unauthorized files in `/public/uploads/`
2. Review recent git commits for suspicious changes
3. Check server processes for crypto miners (xmrig, etc.)
4. Scan for malicious PHP code patterns:
   ```bash
   grep -r "eval\|base64_decode\|gzinflate" .
   ```
5. Review access logs for suspicious requests

## WordPress/Plugin Security (If Applicable)

⚠️ **Warning**: This is a Next.js application. Do NOT install WordPress or PHP CMS plugins.

Common attack vectors to watch for:
- Backdoor file uploads
- SQL injection attempts
- XML-RPC attacks
- wp-admin brute force attempts

## Environment Variables

Ensure these are set and never exposed:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
DATABASE_URL=your-database-connection
NEXTAUTH_SECRET=random-secret-key
NEXTAUTH_URL=your-app-url
```

## Contact

For security concerns, contact:
- Email: contact@sdnthailand.com
- Phone: 02-948-3300

---

Last Updated: December 26, 2024
