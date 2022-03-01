import React, { PureComponent } from 'react';
import {
  RBHeader,
  RBFlex,
  RBSection,
  RBSectionBack,
  RBSave,
  RBField,
  RBInput,
  RBCheckbox
} from '../../../rombostrap';
import { RBInputErrorMessageSection } from '../../../rombostrap/components/RBInput';
import DescriptionSection from '../../common/components/DescriptionSection';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';
import SearchForProducts from '../../common/containers/SearchForProductsContainer';
import QuickKeys from '../../common/components/QuickKeys';

class ManageQuickKeyPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      layoutName: props.qkLayout.qkLayoutName,
      targetIndex: -1
    };
    this.handleLayoutNameChange = this.handleLayoutNameChange.bind(this);
    this.handleSuggestionSelect = this.handleSuggestionSelect.bind(this);
    this.handleTargetIndexChange = this.handleTargetIndexChange.bind(this);
    this.handleKeySelect = this.handleKeySelect.bind(this);
    this.performSave = this.performSave.bind(this);
  }

  handleLayoutNameChange(value) {
    this.setState({ layoutName: value });
  }

  handleSuggestionSelect(suggestion) {
    const { productsHash, addQk } = this.props;
    const qkLayoutId = this.props.match.params.layoutId;
    if (suggestion.variantCount > 0) {
      // @todo: Add Quick Key
    } else {
      const newQuickKey = {
        qkLayoutId: qkLayoutId,
        qkOrder: this.state.targetIndex,
        productId: suggestion.productId,
        qkLabel: productsHash[suggestion.productId].fullname,
        qkColor: 'white',
        qkShowImage: true
      };
      addQk(qkLayoutId, newQuickKey);
    }
  }

  handleKeySelect(qk) {
    if (qk.type === 'blank') {
      this.setState({ targetIndex: qk.order });
    } else {
      // To Do - Edit Quick Key
    }
  }

  handleTargetIndexChange(targetIndex) {
    this.setState({ targetIndex });
  }

  async performSave() {
    const { updateQkLayout, routerReplace } = this.props;
    const qkLayoutId = this.props.match.params.layoutId;
    await updateQkLayout(qkLayoutId, { qkLayoutName: this.state.layoutName });
    routerReplace('/webregister/settings');
  }

  render() {
    const { productsHash, qkLayout } = this.props;
    const { layoutName, targetIndex } = this.state;
    return (
      <div>
        <RBSection>
          <RBHeader category="page">
            <RBSectionBack href="/webregister/settings" />
            Add Quick Key Layout
          </RBHeader>
        </RBSection>
        <RBSection type="action-bar">
          <RBFlex flex flexJustify="between" flexAlign="center">
            <span className="vd-mrl">
              Rename, reposition and recolor keys, or organize your products
              into folders
            </span>
          </RBFlex>
          <RBSave
            form={{ dirty: !layoutName }}
            saving={this.state.saving}
            onSave={this.performSave}
          >
            Save
          </RBSave>
        </RBSection>
        <DescriptionSection title="General">
          <RBField>
            <RBLabel>Layout Name</RBLabel>
            <RBValue>
              <RBInput
                value={layoutName}
                placeholder="Quick Key Layout name"
                onInputChange={this.handleLayoutNameChange}
                onBlur={() => {}}
              />
            </RBValue>
            {false && (
              <RBInputErrorMessageSection>
                This field is required
              </RBInputErrorMessageSection>
            )}
          </RBField>
          <div>
            <strong>Quick Key Behavior</strong>
          </div>
          <RBCheckbox
            label="Leave selected folder open until end of the sale"
            value={false}
            onChange={() => {}}
            classes="vd-mln vd-mtm"
          />
        </DescriptionSection>
        <DescriptionSection
          title="Add Products"
          description="Search for products to add to your Quick Key layout. Drag and drop to rearrange."
        >
          <div className="edit-qk-layout-workspace">
            <SearchForProducts handler={this.handleSuggestionSelect} />
            <div className="edit-qk-layout-panel-layout">
              <QuickKeys
                classes="vd-flex"
                edit
                qkKeys={qkLayout.nodes}
                productsHash={productsHash}
                targetIndex={targetIndex}
                onSelectKey={this.handleKeySelect}
                onTargetIndexChange={this.handleTargetIndexChange}
              />
            </div>
          </div>
        </DescriptionSection>
      </div>
    );
  }
}

export default ManageQuickKeyPage;
