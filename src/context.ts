import * as React from 'react';
import { ReduxRegister } from "./";

export const RegisterProviderContext = React.createContext<ReduxRegister|null>(null);