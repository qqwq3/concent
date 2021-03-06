import register from '../core/base/register';
import React from 'react';
import { CC_DISPATCHER } from '../support/constant';
import ccContext from '../cc-context';
import * as util from '../support/util';

export default function (CustomizedComponent) {
  class DefaultComponent extends React.Component {
    render() {
      return this.props.children || React.createElement('span', {style:{display:'none'}});
    }
  }

  if (ccContext.refs[CC_DISPATCHER]) {
    if(ccContext.isHotReloadMode()){
      util.justTip(`hot reload mode, CC_DISPATCHER existed`);
    }else{
      throw new Error(`CcDispatcher can only be initialize one time`);
    }
  }

  let TargetComponent = CustomizedComponent || DefaultComponent;
  return register({ isSingle: true, __checkStartUp: false, __calledBy: 'cc' }, CC_DISPATCHER)(TargetComponent);
}