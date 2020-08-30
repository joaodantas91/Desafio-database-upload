// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
// import { response } from 'express';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestTDO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestTDO): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    let checkCategoryExists = await categoryRepository.findOne({
      where: { title },
    });

    if (!checkCategoryExists) {
      checkCategoryExists = await categoryRepository.create({ title });
      await categoryRepository.save(checkCategoryExists);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: checkCategoryExists,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
