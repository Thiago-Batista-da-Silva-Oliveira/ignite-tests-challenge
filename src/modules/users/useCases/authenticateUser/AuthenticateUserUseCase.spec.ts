import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("It should authenticate user", () => {
  let inMemoryUsersRepository: IUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let createUserUseCase: CreateUserUseCase;
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should authenticate a user", async () => {
    const user = {
      email: "teste@email.com",
      name: "teste",
      password: "123456",
    };
    await createUserUseCase.execute(user);

    const session = await authenticateUserUseCase.execute({email: user.email, password: user.password})
    expect(session.user).toHaveProperty("id");
    expect(session.token)
  });

  it("should not find user with a incorrect email", async () => {
    const user = {
      email: "testando@email.com",
      name: "teste",
      password: "123456",
    };
    await createUserUseCase.execute(user);
  

    await expect(authenticateUserUseCase.execute({email: 'fake@gmail.com', password: user.password})).rejects.toEqual(
      new AppError("Incorrect email or password", 401)
    );
  });

  it("should not find user with a incorrect password", async () => {
    const user = {
      email: "testando@email.com",
      name: "teste",
      password: "123456",
    };
    await createUserUseCase.execute(user);
  

    await expect(authenticateUserUseCase.execute({email:user.email, password: "12345"})).rejects.toEqual(
      new AppError("Incorrect email or password", 401)
    );
  });
});
