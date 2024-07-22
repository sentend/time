export default <T>(values: T): T & { updatedAt: Date } => ({ ...values, updatedAt: new Date() });
