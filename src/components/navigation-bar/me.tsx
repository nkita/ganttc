import React from "react";
import { Panel, Placeholder, Stack, ButtonGroup, Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

export const Me: React.FC = () => {
    return (
        <>
            <Panel
                bordered
                header={
                    <Stack justifyContent="space-between">
                        <span>About Me</span>
                    </Stack>
                }
            >
                <Placeholder.Paragraph rows={5} graph="image" />
            </Panel>
        </>
    );
};