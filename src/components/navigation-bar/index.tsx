import React from 'react';
import { Nav, Navbar, Badge, Modal } from 'rsuite';
import { NavModal } from './modal';
import styles from "./index.module.css"


export const NavigationBar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState("");
  const handleOpen = (type: string) => {
    setType(type);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <NavModal
        type={type}
        open={open}
        handleClose={handleClose} />
      <Navbar>
        <Navbar.Brand >
          <div className={styles.NavbarBrand}>
            EasyGanttChart<br />
            <span>Copyright © 2022 nkita</span>
          </div>
        </Navbar.Brand>
        <Nav pullRight>
          <Nav.Item onClick={() => handleOpen("info")} ><Badge>お知らせ</Badge></Nav.Item>
          <Nav.Item onClick={() => handleOpen("terms")}>利用する前に</Nav.Item>
          <Nav.Item onClick={() => handleOpen("license")}>ライセンス</Nav.Item>
          <Nav.Item onClick={() => handleOpen("me")}>作者</Nav.Item>
        </Nav>
      </Navbar>
    </>
  );
};
