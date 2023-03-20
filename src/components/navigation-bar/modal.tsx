import React from "react";
import { Modal } from 'rsuite';
import { Info } from './info';
import { License } from './license';
import { Terms } from './terms';
import { Me } from './me';

import 'rsuite/dist/rsuite.min.css';

export const NavModal: React.FC<{
    type: String;
    open: boolean;
    handleClose: () => void;
}> = ({
    type,
    open,
    handleClose
}) => {
        return (
            <>
                <Modal backdrop={true} overflow={true} open={open} onClose={handleClose} size={type === "me" ? "xs" : "md"}>
                    <Modal.Header >
                        {type === "info" && <Modal.Title>お知らせ</Modal.Title>}
                        {type === "terms" && <Modal.Title>利用規約</Modal.Title>}
                        {type === "license" && <Modal.Title>ライセンス</Modal.Title>}
                        {type === "me" && <Modal.Title>作者</Modal.Title>}
                    </Modal.Header>
                    <Modal.Body>
                        {type === "info" && <Info />}
                        {type === "terms" && <Terms />}
                        {type === "license" && <License />}
                        {type === "me" && <Me />}
                    </Modal.Body>
                </Modal>
            </>
        );
    };