import text from './text';
import company from './company';
import donorName from './donor-name';
import email from './email';
import paymentGateways from './payment-gateways';
import donationSummary from './donation-summary';
import amount from './amount';
import {FieldBlock} from '@givewp/form-builder/types';
import fee from '@givewp/form-builder/blocks/fields/fee';

/**
 * @note Blocks in the appender are listed in the order that the blocks are registered.
 */

const fieldBlocks: FieldBlock[] = [text, company, donorName, email, paymentGateways, donationSummary, amount, fee];


export default fieldBlocks;
