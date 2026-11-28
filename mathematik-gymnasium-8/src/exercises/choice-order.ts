import type { ExerciseTask } from "../model/types";
import type { Rng } from "./rng";

/** Shuffle the displayed choices while keeping each field's answer attached. */
export function shuffleTaskChoices(task: ExerciseTask, rng: Rng): ExerciseTask {
  return {
    ...task,
    fields: task.fields.map((field) => {
      if (field.kind !== "choice") return field;
      const order = rng.shuffle(field.options.map((_, index) => index));
      return {
        ...field,
        options: order.map((index) => field.options[index]),
        correctIndex: order.indexOf(field.correctIndex),
      };
    }),
  };
}
