import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("It should show user profile", () => {
  let inMemoryUsersRepository: IUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should show user profile", async () => {
    const user = {
        email: "teste@email.com",
        name: "teste",
        password: "123456",
      };
     const newUser =  await createUserUseCase.execute(user);

     const userProfile = await showUserProfileUseCase.execute(newUser.id)

     expect(userProfile).toHaveProperty("id");
  });

  it("should not show user profile with an id that does not exists", async () => {
    const user = {
      email: "testando@email.com",
      name: "teste",
      password: "123456",
    };
    await createUserUseCase.execute(user);
  

    await expect(showUserProfileUseCase.execute("4414441")).rejects.toEqual(
      new AppError("User not found", 404)
    );
  });
});
