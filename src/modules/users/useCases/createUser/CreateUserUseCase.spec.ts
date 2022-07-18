import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("It should create user test", () => {
  let inMemoryUsersRepository: IUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should create a user", async () => {
    const user = {
      email: "teste@email.com",
      name: "teste",
      password: "123456",
    };
    const newUser = await createUserUseCase.execute(user);
    expect(newUser).toHaveProperty("id");
  });

  it("should not create a user with an existing email", async () => {
    const user = {
      email: "testando@email.com",
      name: "teste",
      password: "123456",
    };
    await createUserUseCase.execute(user);

    const newUser = {
      email: "testando@email.com",
      name: "testando",
      password: "123456",
    };
    await expect(createUserUseCase.execute(newUser)).rejects.toEqual(
      new AppError("User already exists")
    );
  });
});
