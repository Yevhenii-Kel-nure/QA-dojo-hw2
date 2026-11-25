import { faker } from '@faker-js/faker';

export type GeneratedUser = {
  username: string;
  email: string;
  password: string;
};

export function generateUser(): GeneratedUser {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  };
}
