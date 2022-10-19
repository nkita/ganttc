import React, { useEffect, useState } from "react";
import { List, FlexboxGrid } from 'rsuite';
import styles from "./index.module.css"
import 'rsuite/dist/rsuite.min.css';
import { pushData } from "../../helper";


export const Info: React.FC = () => {
    type infoType = {
        no: Number,
        date: String,
        type: "normal" | "emergency",
        contents: String
    }
    const localStorageInformationKey = 'information';
    const [data, setData] = useState<infoType[]>([]);
    useEffect(() => {
        fetch("./information.json", { method: "GET" })
            .then(res => res.json())
            .then(resData => {
                setData(resData)
                pushData(localStorageInformationKey, resData);
            });
    }, []);

    return (
        <List>
            {data.map(d => {
                return (
                    <List.Item key={d.no.toString() + d.date + d.contents}>
                        <FlexboxGrid>
                            <FlexboxGrid.Item colspan={5} className={styles.infoListDate}>
                                {d.date}
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={19} className={styles.infoListContents}>
                                {d.contents}
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </List.Item>
                )
            })}
        </List>
    );
};