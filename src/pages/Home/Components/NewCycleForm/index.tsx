import { useFormContext } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

import { useContext } from "react";
import { CyclesContext } from "../../../../Contexts/Cycles.Context";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-sugegestions"
        placeholder="Dê um nome para o seu projecto"
        disabled={!!activeCycle}
        {...register("task")}
      />

      <datalist id="task-sugegestions">
        <option value="projecto1" />
        <option value="projecto2" />
        <option value="projecto3" />
        <option value="projecto4" />
      </datalist>
      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount "
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycle}
        {...register("minutesAmount", { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}
