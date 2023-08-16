//
//  MappyCore.m
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-07-30.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MappyCore, NSObject)
RCT_EXTERN_METHOD(
  initialize: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)
@end
