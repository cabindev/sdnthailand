import { NextResponse } from "next/server";

export async function GET () {
 try{
    const data = [
        {id:1 , name : 'yongyut',email: 'evo_reaction@HiOutlineMail.com'},
        {id : 2 , name: 'apo',email: 'sdn.warehouse@gmail.com'},
        {id:3 , name: 'dev' , email: 'dev@HomeTwoTone.com' }
    ];
    return NextResponse .json(data);
 }
 catch (error) {
console.error ('error data yellow', error);
     return NextResponse .json({ststus:500});
 };

}