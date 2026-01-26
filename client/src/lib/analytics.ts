export const trackToolUsage = async (name: string, category: string, count: number) => {
  console.log(`Usage tracked: ${name} (${category}) - ${count} files`);
};
