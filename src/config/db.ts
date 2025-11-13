const connectDb = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[db] mock database connection established');
  }
};

export default connectDb;
