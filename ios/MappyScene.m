//
//  MappyScene.m
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-07.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MappyScene, NSObject)
RCT_EXTERN_METHOD(
  load: (NSDictionary *)info
  resolve: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)
@end
