import * as React from 'react';
import { ReduxRegister } from "./";

/**
 * @internal
 */
export const RegisterProviderContext = React.createContext<ReduxRegister|null>(null);