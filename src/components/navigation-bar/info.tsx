import React, { useEffect, useState } from "react";
import 'rsuite/dist/rsuite.min.css';


export const Info: React.FC = () => {
    type infoType = {
        no: Number,
        date: String,
        contents: String
    }
    const [data, setData] = useState<infoType[]>([]);
    useEffect(() => {
        fetch("./information.json", { method: "GET" })
            .then(res => res.json())
            .then(resData => setData(resData));
    }, []);
    return (
        <>{data.map(d => {
            return <div key={d.no.toString() + d.date + d.contents}>{d.date}</div>
        })}
        </>
    );
};