import {
  createContext,
  useState,
  type ReactNode,
  useReducer,
  useEffect,
} from "react";

import {
  addNewCycleAction,
  interruptCurrentCycleAction,
} from "../Reducer/Cycles/actions";
import type { Cycle } from "../Reducer/Cycles/reducer";
import { CyclesReducer } from "../Reducer/Cycles/reducer";
import { differenceInSeconds } from "date-fns";

interface CreateCycleDate {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;

  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  CreateNewCycle: (data: CreateCycleDate) => void;
  InterruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [CyclesStates, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        "@ignite-timer:cycles-state-1.0.0"
      );
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }

      return initialState;
    }
  );

  const { cycles, activeCycleId } = CyclesStates;
  const activeCycle = cycles.find((Cycle) => Cycle.id == activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }

    return 0;
  });

  useEffect(() => {
    const stateJSON = JSON.stringify(CyclesStates);

    localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stateJSON);
  }, [CyclesStates]);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinished());
  }

  function CreateNewCycle(data: CreateCycleDate) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(addNewCycleAction(newCycle));

    setAmountSecondsPassed(0);
  }

  function InterruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        CreateNewCycle,
        InterruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
