import bcrypt from "bcryptjs";
import { users, products, getNextUserId, getNextProductId } from "./data.js";
import { createToken } from "./auth.js";

function requireAuth(context) {
    if (!context.user) {
        throw new Error("Потрібна авторизація.");
    }
    return context.user;
}

export const resolvers = {
    Query: {
        users: () => users,

        me: (parent, args, context) => context.user,

        products: () => products,
    },

    Mutation: {
        register: async (parent, args) => {
            const email = args.email.trim().toLowerCase();

            if (users.some((user) => user.email === email)) {
                throw new Error("Користувач з таким email вже існує.");
            }

            const passwordHash = await bcrypt.hash(args.password, 10);
            const user = {
                id: getNextUserId(),
                name: args.name.trim(),
                email,
                password: passwordHash,
            };
            users.push(user);

            return { token: createToken(user), user };
        },

        login: async (parent, args) => {
            const email = args.email.trim().toLowerCase();
            const user = users.find((item) => item.email === email);

            if (!user) {
                throw new Error("Неправильний email або пароль.");
            }

            const isValid = await bcrypt.compare(args.password, user.password);
            if (!isValid) {
                throw new Error("Неправильний email або пароль.");
            }

            return { token: createToken(user), user };
        },

        createProduct: (parent, args, context) => {
            const user = requireAuth(context);

            if (args.name.trim() === "" || args.description.trim() === "") {
                throw new Error("Назва і опис товару не можуть бути порожніми.");
            }
            if (args.price < 0) {
                throw new Error("Ціна не може бути від'ємною.");
            }

            const product = {
                id: getNextProductId(),
                name: args.name.trim(),
                description: args.description.trim(),
                price: args.price,
                occasion: args.occasion || null,
                color: args.color || null,
                inStock: true,
                ownerId: user.id,
            };
            products.push(product);

            return product;
        },

        deleteProduct: (parent, args, context) => {
            requireAuth(context);

            const index = products.findIndex((product) => product.id === args.id);
            if (index === -1) {
                return false;
            }
            products.splice(index, 1);
            return true;
        },
    },

    Product: {
        owner: (parent) => users.find((user) => user.id === parent.ownerId),
    },
};
