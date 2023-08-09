//
//  MappySceneViewContainer.swift
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-07.
//

import Foundation
import Combine
import Mappy

final class MappySceneViewContainer: UIView {
  
  private lazy var sceneView = SceneView()
  private var scene: Scene?
  private var cancellables = Set<AnyCancellable>()
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(sceneView)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func setScene(_ venueInfo: NSDictionary) {
    let venue = Venue(from: venueInfo)!
    scene = Scene(sceneInfo: venue)
    scene?.load()
      .receive(on: DispatchQueue.main)
      .sink(receiveCompletion: { completion in
        switch completion {
        case .finished: break
        case .failure(let error):
          print("error: \(error)")
        }
      }, receiveValue: { [weak self] in
        self?.sceneView.frame = self?.bounds ?? CGRect(x: 0, y: 0, width: 500, height: 500)
        self?.sceneView.scene = self?.scene
      })
      .store(in: &cancellables)
  }
  
  func rotateToNorth() {
    sceneView.rotateToNorth()
  }
  
  func setInitialViewpoint() {
    sceneView.setInitialViewpoint()
  }
}
