export const LIMIT_PER_PAGE = 20
export const REGEX = {
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PHONE: /^(0)(3|5|7|8|9)+([0-9]{8})$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
}
export const MESSAGE = {
  SUCCESS: "Success",
  ERROR: "Đã có lỗi xảy ra, vui lòng thử lại sau",
  EMAIL_ALREADY_EXIST: "Email đã được sử dụng",
  PHONE_ALREADY_EXIST: "Số điện thoại đã được sử dụng",
  UNAUTHORIZED: "Thông tin đăng nhập không chính xác",
}
