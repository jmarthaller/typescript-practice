// function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
//     return arr1.concat(arr2);
//   }

// const arr = combine<string | number >([1, 2, 3], ["hello"]);



import {MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

const main = async () => {
    const orm = await MikroORM.init({
        dbName: 'portfolio',
        user: '',
        password: '',
        type: 'postgresql',
        debug: !__prod__,
    });
}

main()






 