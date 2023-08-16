//
//  MappyMapViewManager.swift
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-03.
//

import Foundation

@objc(MappyMapViewManager)
final class MappyMapViewManager: RCTViewManager {
  override func view() -> UIView! {
    return MappyMapViewContainer()
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func setMap(_ node: NSNumber, venueInfo: NSDictionary) {
      DispatchQueue.main.async {
        self.mappyMapViewContainer(node).setMap(venueInfo)
      }
  }
  
  @objc
  func rotateToNorth(_ node: NSNumber) {
    DispatchQueue.main.async {
      self.mappyMapViewContainer(node).rotateToNorth()
    }
  }
  
  @objc
  func setInitialViewpoint(_ node: NSNumber) {
    DispatchQueue.main.async {
      self.mappyMapViewContainer(node).setInitialViewpoint()
    }
  }
  
  private func mappyMapViewContainer(_ node: NSNumber) -> MappyMapViewContainer {
    self.bridge.uiManager.view(forReactTag: node) as! MappyMapViewContainer
  }
}
