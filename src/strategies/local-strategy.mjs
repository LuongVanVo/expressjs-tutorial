import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";

// hàm này sẽ được gọi khi người dùng đăng nhập thành công
// nó sẽ lưu thông tin người dùng vào session
passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id); // đối số thứ 2 là thông tin người dùng sẽ được lưu vào session
});

// hàm này sẽ được gọi khi người dùng đăng xuất hoặc khi cần lấy thông tin người dùng từ session
// nó sẽ tìm kiếm người dùng trong mockUsers dựa trên id đã lưu trong session
// nếu tìm thấy, nó sẽ trả về thông tin người dùng, nếu không tìm thấy, nó sẽ trả về null
// done là hàm callback để trả về kết quả
passport.deserializeUser(async (id, done) => {
  console.log(`Inside Deserialize User`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error('User not found !!');
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser)  throw new Error('User not found');
      if (findUser.password !== password) throw new Error('Bad Credentials');
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
