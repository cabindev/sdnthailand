//app/yellow/page.tsx
'use client'
import { useEffect,useState } from "react"

interface Yellow {
    id:number;
    name:string;
    email:string
};

export default function yellowPage(){
    const [yellow,setYellow] = useState <Yellow []>([]);
    const [loading, setLoading] = useState ( true);
        useEffect (()=>{
         const fetchYellow = async ()=>{
            try{
                const res = await fetch ('api/yellow');
                const data : Yellow[] = await res .json ();
                setYellow (data);

            } catch (error) {
                console.error ('error fetching yellow',error);    

            } finally {
                setLoading(false);
            }
                 };
                 fetchYellow ();

        }, []);
        if (loading) 
        return 
        <p>Loading....</p>;
        return (
            <div>
                <h1>User List</h1>
                <ul>
                    {yellow.map(yellow => (
                        <li key={yellow.id}>
                            <p>Name: {yellow.name}</p>
                            <p>Email: {yellow.email}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }


