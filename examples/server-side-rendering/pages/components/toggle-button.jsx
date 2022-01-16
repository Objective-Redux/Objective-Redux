// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { useController } from 'objective-redux';
import { SwitchStateController } from '../../state-controllers/switch-state-controller';

export default function ToggleButton() {
  const controller = useController(SwitchStateController);
  const current = controller?.getStateSlice()?.isOn ? ' off' : ' on';

  return (
    <button id="toggle-btn" onClick={() => controller.toggleSwitchValue()}>
      Toggle switch
      {current}
    </button>
  );
}
