// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { ObjectiveStore, ObjectiveStoreProvider } from 'objective-redux';
import Head from 'next/head';
import ToggleButton from './components/toggle-button';

const objectiveStore = new ObjectiveStore();

export default function Home() {
  return (
    <>
      <Head>
        <title>Server-Side Rendering App</title>
      </Head>

      <main>
        <ObjectiveStoreProvider objectiveStore={objectiveStore}>
          <ToggleButton />
        </ObjectiveStoreProvider>
      </main>
    </>
  );
}
