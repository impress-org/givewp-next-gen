import {FieldBlock} from '@givewp/form-builder/types';

import text from './text';
import company from './company';
import donorName from './donor-name';
import email from './email';
import paymentGateways from './payment-gateways';
import donationSummary from './donation-summary';
import amount from './amount';

/**
 * @note Blocks in the appender are listed in the order that the blocks are registered.
 */
const FieldBlocks: FieldBlock[] = [text, company, donorName, email, paymentGateways, donationSummary, amount];

export default FieldBlocks;