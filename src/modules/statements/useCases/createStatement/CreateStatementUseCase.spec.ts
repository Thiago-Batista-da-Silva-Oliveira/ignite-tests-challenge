
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


describe("It should create statement", () => {
  enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
  }
  let inMemoryUsersRepository: IUsersRepository;
  let inMemoryStatementsRepository:IStatementsRepository
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
        inMemoryUsersRepository,
        inMemoryStatementsRepository
    );
  });

  it("should create statement", async () => {
    const user = {
        email: "teste@email.com",
        name: "teste",
        password: "123456",
      };
     const newUser =  await createUserUseCase.execute(user);

     const statement = await createStatementUseCase.execute({amount: 200,
         description: "Deposit",
         type:OperationType.DEPOSIT,
         user_id: newUser.id
     })

     expect(statement).toHaveProperty("id");
  });

  it("should be able to withdraw money", async () => {
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

     const withdraw_statement = await createStatementUseCase.execute({
        amount: 100,
        description: "Withdraw",
        type:OperationType.WITHDRAW,
        user_id: newUser.id
    })

     expect(withdraw_statement).toHaveProperty("id");
  });

  it("should not be able to withdraw money without the necessary balance", async () => {
    const user = {
        email: "teste@email.com",
        name: "teste",
        password: "123456",
      };
     const newUser =  await createUserUseCase.execute(user);

      await createStatementUseCase.execute({amount: 100,
         description: "Deposit",
         type:OperationType.DEPOSIT,
         user_id: newUser.id
     })
     await expect(createStatementUseCase.execute({amount: 200,
        description: "Withdraw",
        type:OperationType.WITHDRAW,
        user_id: newUser.id
    })).rejects.toEqual(
      new AppError("Insufficient funds", 400)
    );
  });

  it("should not be able to create a statement without finding the user", async () => {
    const user = {
      email: "testando@email.com",
      name: "teste",
      password: "123456",
    };
    await createUserUseCase.execute(user);
    await expect(createStatementUseCase.execute({amount: 200,
        description: "Deposit",
        type:OperationType.DEPOSIT,
        user_id: "12441111"
    })).rejects.toEqual(
      new AppError("User not found", 404)
    );
  });
});
