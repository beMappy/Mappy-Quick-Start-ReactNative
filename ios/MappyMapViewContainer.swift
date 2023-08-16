//
//  MappyMapViewContainer.swift
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-03.
//

import Foundation
import Combine
import Mappy

final class MappyMapViewContainer: UIView {
  
  private lazy var mapView: MapView = MapView()
  private var map: Map?
  private var cancellables = Set<AnyCancellable>()
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    self.addSubview(mapView)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func setMap(_ venueInfo: NSDictionary) {
    let venue = Venue(from: venueInfo)!
    map = Map(mapInfo: venue)
    map?.load()
      .receive(on: DispatchQueue.main)
      .sink(receiveCompletion: { completion in
        switch completion {
        case .finished: break
        case .failure(let error):
          print("error: \(error)")
        }
      }, receiveValue: { [weak self] in
        self?.mapView.frame = self?.bounds ?? CGRect(x: 0, y: 0, width: 500, height: 500)
        self?.mapView.map = self?.map
      })
      .store(in: &cancellables)
  }
  
  func rotateToNorth() {
    mapView.rotateToNorth()
  }
  
  func setInitialViewpoint() {
    mapView.setInitialViewpoint()
  }
}
