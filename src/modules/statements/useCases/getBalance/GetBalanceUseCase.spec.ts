
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



describe("It should get balance", () => {
  enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
  }
  let inMemoryUsersRepository: IUsersRepository;
  let inMemoryStatementsRepository:IStatementsRepository
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase
  let getBalanceUseCase: GetBalanceUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
        inMemoryUsersRepository,
        inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
        inMemoryStatementsRepository,
        inMemoryUsersRepository,
    );
  });

  it("should be able to get the balance", async () => {
    const user = {
        email: "teste@email.com",
        name: "teste",
        password: "123456",
      };
     const newUser =  await createUserUseCase.execute(user);

      await createStatementUseCase.execute({amount: 200,
         description: "Deposit",
         type:OperationType.DEPOSIT,
         user_id: newUser.id
     })

     await createStatementUseCase.execute({amount: 50,
        description: "WithDraw",
        type:OperationType.WITHDRAW,
        user_id: newUser.id
    })

     const balance = await getBalanceUseCase.execute({user_id: newUser.id})

     expect(balance.balance).toBe(150)
  });

  
  it("should not be able to get the balance without a user id", async () => {
    const user = {
        email: "teste@email.com",
        name: "teste",
        password: "123456",
      };
     const newUser =  await createUserUseCase.execute(user);

      await createStatementUseCase.execute({amount: 200,
         description: "Deposit",
         type:OperationType.DEPOSIT,
         user_id: newUser.id
     })

     await createStatementUseCase.execute({amount: 50,
        description: "WithDraw",
        type:OperationType.WITHDRAW,
        user_id: newUser.id
    })

     await expect( getBalanceUseCase.execute({user_id: '44557'})).rejects.toEqual(
    new AppError("User not found", 404)
  );
  });
});
