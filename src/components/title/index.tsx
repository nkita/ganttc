import React, { Ref, useEffect, useRef } from "react";
import { Popover, Whisper, IconButton, Col, Row, Toggle, useToaster, Message, ButtonToolbar, ButtonGroup, Button, Dropdown, DropdownProps } from 'rsuite';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';
import ConversionIcon from '@rsuite/icons/Conversion';
import { GanttList } from "../../common/types/public-types";
import commonStyles from "../../common/css/index.module.css";


interface Title {
    title: string,
    glist: GanttList[],
    onChange: (flg: boolean) => void;
    onChangeGC: (id: string) => void;
    setTitle: (title: string) => void;
}

const renderIconButton = (props: any, ref: any) => {
    return (
        <IconButton {...props} ref={ref} icon={<ArrowDownIcon />} size="xs" color="cyan" />
    );
};


export const Title: React.FC<Title> = ({
    title,
    glist,
    onChange,
    onChangeGC,
    setTitle,
}) => {
    const ref = useRef<HTMLInputElement>(null)

    const onChangeInput = () => {
        onChange(false)
        if (ref.current !== null) setTitle(ref.current.value)
    }
    useEffect(() => {
        if (ref.current !== null) ref.current.value = title
    }, [title])

    return (
        <>
            <Dropdown renderToggle={renderIconButton} >
                {
                    glist.map((g) => {
                        return (
                            <Dropdown.Item icon={<ConversionIcon style={{ marginRight: 10 }} />} key={g.id} onSelect={e => onChangeGC(g.id)}>{g.title}</Dropdown.Item>
                        )
                    })
                }
            </Dropdown>
            <input type="text" ref={ref} className={commonStyles.taskLabel} onChange={e => onChangeInput()} defaultValue={title} placeholder="タイトルを入力" />
        </>
    )
}