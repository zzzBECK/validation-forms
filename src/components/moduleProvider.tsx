import { D1ModuleState, defaultD1ModuleState } from "@/types/d1moduleState";
import React, { useState, useMemo, createContext, ReactNode } from "react";

const D1ModuleContext = createContext<D1ModuleState>(defaultD1ModuleState);

interface D1ModuleProviderProps {
    children: ReactNode;
}

export const D1ModuleProvider: React.FC<D1ModuleProviderProps> = ({ children }) => {
    // D1FirstModule states
    const [m1ScoreItem1, m1SetScoreItem1] = useState(0);
    const [m1ScoreItem2, m1SetScoreItem2] = useState(0);
    const [m1ScoreItem3, m1SetScoreItem3] = useState(0);
    const [m1ScoreItem4, m1SetScoreItem4] = useState(0);
    const [m1ScoreItem5, m1SetScoreItem5] = useState(0);
    const [m1ScoreItem6, m1SetScoreItem6] = useState(0);
    const [m1ScoreItem7, m1SetScoreItem7] = useState(0);
    const [m1FinalResult, m1SetFinalResult] = useState(0);

    // D1SecondModule states
    const [m2ScoreItem1, m2SetScoreItem1] = useState(0);
    const [m2ScoreItem2, m2SetScoreItem2] = useState(0);
    const [m2ScoreItem3, m2SetScoreItem3] = useState(0);
    const [m2ScoreItem4, m2SetScoreItem4] = useState(0);
    const [m2ScoreItem5, m2SetScoreItem5] = useState(0);
    const [m2ScoreItem6, m2SetScoreItem6] = useState(0);
    const [m2ScoreItem7, m2SetScoreItem7] = useState(0);
    const [m2ScoreItem8, m2SetScoreItem8] = useState(0);
    const [m2ScoreItem9, m2SetScoreItem9] = useState(0);
    const [m2ScoreItem10, m2SetScoreItem10] = useState(0);
    const [m2FinalResult, m2SetFinalResult] = useState(0);

    const moduleState = useMemo(
        () => ({
            // D1FirstModule states
            m1ScoreItem1,
            m1SetScoreItem1,
            m1ScoreItem2,
            m1SetScoreItem2,
            m1ScoreItem3,
            m1SetScoreItem3,
            m1ScoreItem4,
            m1SetScoreItem4,
            m1ScoreItem5,
            m1SetScoreItem5,
            m1ScoreItem6,
            m1SetScoreItem6,
            m1ScoreItem7,
            m1SetScoreItem7,
            m1FinalResult,
            m1SetFinalResult,
            // D1SecondModule states
            m2ScoreItem1,
            m2SetScoreItem1,
            m2ScoreItem2,
            m2SetScoreItem2,
            m2ScoreItem3,
            m2SetScoreItem3,
            m2ScoreItem4,
            m2SetScoreItem4,
            m2ScoreItem5,
            m2SetScoreItem5,
            m2ScoreItem6,
            m2SetScoreItem6,
            m2ScoreItem7,
            m2SetScoreItem7,
            m2ScoreItem8,
            m2SetScoreItem8,
            m2ScoreItem9,
            m2SetScoreItem9,
            m2ScoreItem10,
            m2SetScoreItem10,
            m2FinalResult,
            m2SetFinalResult,
        }),
        [
            m1ScoreItem1,
            m1ScoreItem2,
            m1ScoreItem3,
            m1ScoreItem4,
            m1ScoreItem5,
            m1ScoreItem6,
            m1ScoreItem7,
            m1FinalResult,
            m2ScoreItem1,
            m2ScoreItem2,
            m2ScoreItem3,
            m2ScoreItem4,
            m2ScoreItem5,
            m2ScoreItem6,
            m2ScoreItem7,
            m2ScoreItem8,
            m2ScoreItem9,
            m2ScoreItem10,
            m2FinalResult,
        ]
    );

    return (
        <D1ModuleContext.Provider value={moduleState}>
            {children}
        </D1ModuleContext.Provider>
    );
};

export default D1ModuleContext;
