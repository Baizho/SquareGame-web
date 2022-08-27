
import { NextApiRequest, NextApiResponse, NextPageContext } from "next"
import { useRouter } from 'next/router'
import dotenv from 'dotenv'
import { resolve } from "path";

dotenv.config();

const mysql = require('mysql');

const con = mysql.createConnection(process.env.database_url);

con.connect((err: any, res: any) => {
    if (err) throw err;
})

function getData(sql: string, value: string) {
    //console.log("get"+sql);
    return new Promise<void>((resolve, reject) => {
        con.query(sql, value, function (err: any, res: any) {
            if (err) reject("error brochacho")
            resolve(res);
        })
    });
}
function addData(sql: string, value: string | any[][]) {
    //console.log("add"+sql);
    return new Promise<void>((resolve, reject) => {
        con.query(sql, [value], function (err: any, res: any) {
            if (err) reject("error brochacho")
            resolve(res);
        })
    });

}

let sequencer = Promise.resolve();

export default async function Vehicles(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        let respon: any;
        let list: any = await getData("select * from records order by score DESC", "");
        for (let i = 10; i < list.length; i++) {
            if (list[i] === undefined) { continue; }
            await getData(`delete from records where id = ${list[i].id}`, "");
        }
        list = await getData("select * from records order by score DESC", "");
        res.end(JSON.stringify(list));

    }
    else if (req.method === 'POST') {
        const name = req.body.name;
        const score = req.body.score;
        let respon: any;
        let list: any = await getData("select * from records order by score DESC", "");
        if(list.length>=10){if(list[9].score<score){await addData("insert into records values ? ", [[null, name, score]]);}}
         else {await addData("insert into records values ? ", [[null, name, score]]);}
        res.end(JSON.stringify(list));
    }


}

