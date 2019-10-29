import React from "react";

import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ToastAndroid
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default class CameraScreen extends React.Component {
  static navigationOptions = {
    title: "Scan QR"
  };

  state = {
    flash: "off",
    zoom: 0,
    autoFocus: "on",
    type: "back",
    whiteBalance: "auto",
    ratio: "16:9",
    ratios: [],
    barcodeScanning: true,
    faceDetecting: false,
    faces: [],
    newPhotos: false,
    permissionsGranted: false,
    pictureSize: undefined,
    pictureSizes: [],
    pictureSizeId: 0,
    showGallery: false,
    showMoreOptions: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === "granted" });
  }

  componentDidMount() {
    // FileSystem.makeDirectoryAsync(
    //   FileSystem.documentDirectory + "photos"
    // ).catch(e => {
    //   console.log(e, "Directory exists");
    // });
  }

  getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  setRatio = ratio => this.setState({ ratio });

  toggleBarcodeScanning = () =>
    this.setState({ barcodeScanning: !this.state.barcodeScanning });

  handleMountError = ({ message }) => console.error(message);

  onBarCodeScanned = code => {
    // this.setState(
    //   { barcodeScanning: !this.state.barcodeScanning },
    //   Alert.alert(`Barcode found: ${code.data}`)
    // );
    // Alert.alert(`Barcode found: ${code.data}`);
    console.log("Scanned");

    if (code.data.indexOf("tbloyalty://") !== -1) {
      this.props.navigation.replace("Reward", {
        scanData: code.data
      });
    } else {
      ToastAndroid.show("Invalid QR Code", ToastAndroid.SHORT);
    }
  };

  collectPictureSizes = async () => {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(
        this.state.ratio
      );
      let pictureSizeId = 0;
      if (Platform.OS === "ios") {
        pictureSizeId = pictureSizes.indexOf("High");
      } else {
        // returned array is sorted in ascending order - default size is the largest one
        let _sizeId = pictureSizes.indexOf("1920x1080");

        if (_sizeId !== -1) {
          pictureSizeId = _sizeId;
        } else {
          pictureSizeId = 0;
        }
      }

      this.setState({
        pictureSizes,
        pictureSizeId,
        pictureSize: pictureSizes[pictureSizeId]
      });
    }
  };

  previousPictureSize = () => this.changePictureSize(1);
  nextPictureSize = () => this.changePictureSize(-1);

  changePictureSize = direction => {
    let newId = this.state.pictureSizeId + direction;
    const length = this.state.pictureSizes.length;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length - 1;
    }
    this.setState({
      pictureSize: this.state.pictureSizes[newId],
      pictureSizeId: newId
    });
  };

  renderNoPermissions = () => (
    <View style={styles.noPermissions}>
      <Text style={{ color: "white" }}>
        Camera permissions not granted - cannot open camera preview.
      </Text>
    </View>
  );

  renderMoreOptions = () => (
    <View style={styles.options}>
      <View style={styles.detectors}>
        <TouchableOpacity onPress={this.toggleBarcodeScanning}>
          <MaterialCommunityIcons
            name="barcode-scan"
            size={32}
            color={this.state.barcodeScanning ? "white" : "#858585"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.pictureSizeContainer}>
        <Text style={styles.pictureQualityLabel}>Picture quality</Text>
        <View style={styles.pictureSizeChooser}>
          <TouchableOpacity
            onPress={this.previousPictureSize}
            style={{ padding: 6 }}
          >
            <Ionicons name="md-arrow-dropleft" size={14} color="white" />
          </TouchableOpacity>
          <View style={styles.pictureSizeLabel}>
            <Text style={{ color: "white" }}>{this.state.pictureSize}</Text>
          </View>
          <TouchableOpacity
            onPress={this.nextPictureSize}
            style={{ padding: 6 }}
          >
            <Ionicons name="md-arrow-dropright" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderCamera = () => (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.camera}
        onCameraReady={this.collectPictureSizes}
        ratio={this.state.ratio}
        pictureSize={this.state.pictureSize}
        onMountError={this.handleMountError}
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.qr
            // BarCodeScanner.Constants.BarCodeType.pdf417
          ]
        }}
        onBarCodeScanned={
          this.state.barcodeScanning ? this.onBarCodeScanned : undefined
        }
      ></Camera>
      {/* {this.renderMoreOptions()} */}
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: 220,
            height: 220,
            borderStyle: "dashed",
            borderWidth: 3,
            borderColor: "rgba(255, 255, 255, 0.75)",
            borderRadius: 10
          }}
        ></View>
      </View>
    </View>
  );

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    return <View style={styles.container}>{cameraScreenContent}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  camera: {
    flex: 1,
    justifyContent: "space-between"
  },
  noPermissions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  options: {
    position: "absolute",
    bottom: 80,
    left: 30,
    width: 200,
    height: 160,
    backgroundColor: "#000000BA",
    borderRadius: 4,
    padding: 10
  },
  detectors: {
    flex: 0.5,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  },
  pictureQualityLabel: {
    fontSize: 10,
    marginVertical: 3,
    color: "white"
  },
  pictureSizeContainer: {
    flex: 0.5,
    alignItems: "center",
    paddingTop: 10
  },
  pictureSizeChooser: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  pictureSizeLabel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  row: {
    flexDirection: "row"
  }
});
