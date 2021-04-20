const debugMode = true;

// 是否以Supervisor的形式运行
const isSupervisor = Boolean(process.env.SUPERVISOR_TOKEN);

export { debugMode, isSupervisor };
