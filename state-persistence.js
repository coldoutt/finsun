export class FinanceStateConflictError extends Error {
  constructor() {
    super("Данные уже изменены в другой вкладке или на другом устройстве. Обновите страницу перед повторным сохранением.");
    this.name = "FinanceStateConflictError";
  }
}

export function createStateConflictError() {
  return new FinanceStateConflictError();
}

export function createSerializedExecutor() {
  let queue = Promise.resolve();
  return function runSerialized(task) {
    const operation = queue.catch(() => undefined).then(task);
    queue = operation;
    return operation;
  };
}
