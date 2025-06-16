import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

// hàm này sẽ được gọi khi người dùng đăng nhập thành công
// nó sẽ lưu thông tin người dùng vào session
passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.username); // đối số thứ 2 là thông tin người dùng sẽ được lưu vào session
});

// hàm này sẽ được gọi khi người dùng đăng xuất hoặc khi cần lấy thông tin người dùng từ session
// nó sẽ tìm kiếm người dùng trong mockUsers dựa trên id đã lưu trong session
// nếu tìm thấy, nó sẽ trả về thông tin người dùng, nếu không tìm thấy, nó sẽ trả về null
// done là hàm callback để trả về kết quả
passport.deserializeUser((username, done) => {
  console.log(`Inside Deserialize User`);
  try {
    const findUser = mockUsers.find((user) => user.username === username);
    if (!findUser) throw new Error('User not found !!');
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("User not found");

      if (findUser.password !== password)
        throw new Error("Invalid Credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
