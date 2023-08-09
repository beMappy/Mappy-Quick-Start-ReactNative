//
//  MappyCore.swift
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-07-30.
//

import Foundation
import Combine
import Mappy

@objc(MappyCore)
final class MappyCore: NSObject {
  
  private var cancellables = Set<AnyCancellable>()
  
  private let clientId = "<clientId>"
  private let clientSecret = "<clientSecret>"
  
  private var mappyUserId: String? {
      get {
          UserDefaults.standard.string(forKey: "\(clientId):mp_userId")
      } set {
          UserDefaults.standard.set(newValue, forKey: "\(clientId):mp_userId")
      }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func initialize(_ resolve: @escaping RCTPromiseResolveBlock,
            rejecter reject: @escaping RCTPromiseRejectBlock) {
    Mappy.MappyCore.initialize(clientId: clientId, secret: clientSecret, mappyUserId: mappyUserId)
        .sink(receiveCompletion: {
            if case .failure(let error) = $0 {
                print("initialize: error: \(error)")
              reject("error_code", "Initialize failed", error)
            }
        }, receiveValue: { [unowned self] in
            self.mappyUserId = $0.mappyUserId
            resolve($0.mappyUserId)
        })
        .store(in: &cancellables)
  }
}
