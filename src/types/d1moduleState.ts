import { Dispatch, SetStateAction } from "react";

// Tipos para os estados do D1FirstModule
export interface D1FirstModuleState {
  m1ScoreItem1: number;
  m1SetScoreItem1: Dispatch<SetStateAction<number>>;
  m1ScoreItem2: number;
  m1SetScoreItem2: Dispatch<SetStateAction<number>>;
  m1ScoreItem3: number;
  m1SetScoreItem3: Dispatch<SetStateAction<number>>;
  m1ScoreItem4: number;
  m1SetScoreItem4: Dispatch<SetStateAction<number>>;
  m1ScoreItem5: number;
  m1SetScoreItem5: Dispatch<SetStateAction<number>>;
  m1ScoreItem6: number;
  m1SetScoreItem6: Dispatch<SetStateAction<number>>;
  m1ScoreItem7: number;
  m1SetScoreItem7: Dispatch<SetStateAction<number>>;
  m1FinalResult: number;
  m1SetFinalResult: Dispatch<SetStateAction<number>>;
}

// Tipos para os estados do D1SecondModule
export interface D1SecondModuleState {
  m2ScoreItem1: number;
  m2SetScoreItem1: Dispatch<SetStateAction<number>>;
  m2ScoreItem2: number;
  m2SetScoreItem2: Dispatch<SetStateAction<number>>;
  m2ScoreItem3: number;
  m2SetScoreItem3: Dispatch<SetStateAction<number>>;
  m2ScoreItem4: number;
  m2SetScoreItem4: Dispatch<SetStateAction<number>>;
  m2ScoreItem5: number;
  m2SetScoreItem5: Dispatch<SetStateAction<number>>;
  m2ScoreItem6: number;
  m2SetScoreItem6: Dispatch<SetStateAction<number>>;
  m2ScoreItem7: number;
  m2SetScoreItem7: Dispatch<SetStateAction<number>>;
  m2ScoreItem8: number;
  m2SetScoreItem8: Dispatch<SetStateAction<number>>;
  m2ScoreItem9: number;
  m2SetScoreItem9: Dispatch<SetStateAction<number>>;
  m2ScoreItem10: number;
  m2SetScoreItem10: Dispatch<SetStateAction<number>>;
  m2FinalResult: number;
  m2SetFinalResult: Dispatch<SetStateAction<number>>;
}

export type D1ModuleState = D1FirstModuleState & D1SecondModuleState;

export const defaultD1ModuleState: D1ModuleState = {
  // D1FirstModule states
  m1ScoreItem1: 0,
  m1SetScoreItem1: () => {},
  m1ScoreItem2: 0,
  m1SetScoreItem2: () => {},
  m1ScoreItem3: 0,
  m1SetScoreItem3: () => {},
  m1ScoreItem4: 0,
  m1SetScoreItem4: () => {},
  m1ScoreItem5: 0,
  m1SetScoreItem5: () => {},
  m1ScoreItem6: 0,
  m1SetScoreItem6: () => {},
  m1ScoreItem7: 0,
  m1SetScoreItem7: () => {},
  m1FinalResult: 0,
  m1SetFinalResult: () => {},
  // D1SecondModule states
  m2ScoreItem1: 0,
  m2SetScoreItem1: () => {},
  m2ScoreItem2: 0,
  m2SetScoreItem2: () => {},
  m2ScoreItem3: 0,
  m2SetScoreItem3: () => {},
  m2ScoreItem4: 0,
  m2SetScoreItem4: () => {},
  m2ScoreItem5: 0,
  m2SetScoreItem5: () => {},
  m2ScoreItem6: 0,
  m2SetScoreItem6: () => {},
  m2ScoreItem7: 0,
  m2SetScoreItem7: () => {},
  m2ScoreItem8: 0,
  m2SetScoreItem8: () => {},
  m2ScoreItem9: 0,
  m2SetScoreItem9: () => {},
  m2ScoreItem10: 0,
  m2SetScoreItem10: () => {},
  m2FinalResult: 0,
  m2SetFinalResult: () => {},
};
