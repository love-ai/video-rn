import BasePage from "../base/BasePage";
import BaseComponent from "../base/BaseComponent";
import { View } from "react-native";

export default class VideoListPage extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      title: "培训视频",
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <BaseComponent {...this.state} >
        {this.getContentView()}
      </BaseComponent>
    );
  }

  getContentView() {
    return <View />;
  }
}
