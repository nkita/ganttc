import React from "react";
import { Icon } from '@rsuite/icons';
import { Panel, Button, ButtonToolbar, Stack, Avatar } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import styles from "./index.module.css"
import { FaHome, FaTwitter } from 'react-icons/fa';

export const Me: React.FC = () => {
    return (
        <>
            <Panel
                header={
                    <Stack spacing={20} direction="column" justifyContent="center">
                        <Avatar circle src="./me.png" size="lg" alt="@nkita" />
                        <Stack>
                            <span className={styles.name}>nkita</span>
                        </Stack>
                        <Stack >
                            <Button appearance="link" href="https://blog.nkitao.com/"><Icon as={FaHome} /> blog.nkitao.com</Button>
                            <Button appearance="link" href="https://twitter.com/nkitao7"><Icon as={FaTwitter} /> nkitao7</Button>
                        </Stack>
                    </Stack>
                }
            >
            </Panel>
        </>
    );
};