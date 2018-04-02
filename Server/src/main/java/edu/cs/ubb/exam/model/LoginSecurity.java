package edu.cs.ubb.exam.model;

/**
 * Created by Szilu on 2017. 05. 10..
 */

public class LoginSecurity {
        private final User user;
        private final String token;

        public LoginSecurity(User user, String token) {
            this.user = user;
            this.token = token;
        }

        public User getUser() {
            return user;
        }
        public String getToken() {
            return token;
        }
}
