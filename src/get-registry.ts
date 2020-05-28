import { getContext } from "redux-saga/effects";

export function* getRegisterFromContext() {
  return yield getContext('register');
}
