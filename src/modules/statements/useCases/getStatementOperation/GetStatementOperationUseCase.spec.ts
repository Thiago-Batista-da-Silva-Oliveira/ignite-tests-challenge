import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("It should get the statement operation", () => {
  enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
  }
  let inMemoryUsersRepository: IUsersRepository;
  let inMemoryStatementsRepository: IStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get the balance", async () => {
    const user = {
      email: "teste@email.com",
      name: "teste",
      password: "123456",
    };
    const newUser = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      amount: 200,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id: newUser.id,
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id,
      user_id: newUser.id,
    });

    expect(statementOperation.type).toBe("deposit");
  });

  it("should not be able to get the statement without a valid user id", async () => {
    const user = {
      email: "teste@email.com",
      name: "teste",
      password: "123456",
    };
    const newUser = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      amount: 200,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id: newUser.id,
    });
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "44557",
        statement_id: statement.id,
      })
    ).rejects.toEqual(new AppError("User not found", 404));
  });

  it("should not be able to get the statement without a valid statement id", async () => {
    const user = {
      email: "teste@email.com",
      name: "teste",
      password: "123456",
    };
    const newUser = await createUserUseCase.execute(user);
    await createStatementUseCase.execute({
      amount: 200,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id: newUser.id,
    });
    await expect(
      getStatementOperationUseCase.execute({
        user_id: newUser.id,
        statement_id: "14454",
      })
    ).rejects.toEqual(new AppError("Statement not found", 404));
  });
});
