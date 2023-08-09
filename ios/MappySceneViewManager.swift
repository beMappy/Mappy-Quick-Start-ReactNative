//
//  MappySceneViewManager.swift
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-07.
//

import Foundation

@objc(MappySceneViewManager)
final class MappySceneViewManager: RCTViewManager {
  override func view() -> UIView! {
    return MappySceneViewContainer()
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func setScene(_ node: NSNumber, venueInfo: NSDictionary) {
      DispatchQueue.main.async {
        self.mappySceneViewContainer(node).setScene(venueInfo)
      }
  }
  
  @objc
  func rotateToNorth(_ node: NSNumber) {
    DispatchQueue.main.async {
      self.mappySceneViewContainer(node).rotateToNorth()
    }
  }
  
  @objc
  func setInitialViewpoint(_ node: NSNumber) {
    DispatchQueue.main.async {
      self.mappySceneViewContainer(node).setInitialViewpoint()
    }
  }
  
  private func mappySceneViewContainer(_ node: NSNumber) -> MappySceneViewContainer {
    self.bridge.uiManager.view(forReactTag: node) as! MappySceneViewContainer
  }
}
