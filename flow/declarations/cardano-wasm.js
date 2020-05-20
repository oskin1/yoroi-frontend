// @flow

/* eslint-disable camelcase */

/**
 * Flowtype definitions for cardano_wallet
 * Generated by Flowgen from a Typescript Definition
 * Flowgen v1.8.0
 * Author: [Joar Wilk](http://twitter.com/joarwilk)
 * Repo: http://github.com/joarwilk/flowgen
 */
declare module 'cardano-wallet-browser' { // need to wrap flowgen output into module
  /**
   * @param {Entropy} entropy
   * @param {Uint8Array} iv
   * @param {string} password
   * @returns {Uint8Array}
   */
  declare export function paper_wallet_scramble(
    entropy: Entropy,
    iv: Uint8Array,
    password: string
  ): Uint8Array;

  /**
   * @param {Uint8Array} paper
   * @param {string} password
   * @returns {Entropy}
   */
  declare export function paper_wallet_unscramble(
    paper: Uint8Array,
    password: string
  ): Entropy;

  /**
   * encrypt the given data with a password, a salt and a nonce
   *
   * Salt: must be 32 bytes long;
   * Nonce: must be 12 bytes long;
   * @param {string} password
   * @param {Uint8Array} salt
   * @param {Uint8Array} nonce
   * @param {Uint8Array} data
   * @returns {Uint8Array}
   */
  declare export function password_encrypt(
    password: string,
    salt: Uint8Array,
    nonce: Uint8Array,
    data: Uint8Array
  ): Uint8Array;

  /**
   * decrypt the data with the password
   * @param {string} password
   * @param {Uint8Array} encrypted_data
   * @returns {aUint8Arrayny}
   */
  declare export function password_decrypt(
    password: string,
    encrypted_data: Uint8Array
  ): Uint8Array;

  /**
   */
  declare export class AccountIndex {
    free(): void;

    /**
     * @param {number} index
     * @returns {AccountIndex}
     */
    static new(index: number): AccountIndex;
  }
  /**
   */
  declare export class Address {
    free(): void;

    /**
     * @returns {string}
     */
    to_base58(): string;

    /**
     * @param {string} s
     * @returns {Address}
     */
    static from_base58(s: string): Address;

    static is_valid(s: string): boolean;
  }
  /**
   */
  declare export class AddressKeyIndex {
    free(): void;

    /**
     * @param {number} index
     * @returns {AddressKeyIndex}
     */
    static new(index: number): AddressKeyIndex;
  }
  /**
   */
  declare export class Bip44AccountPrivate {
    free(): void;

    /**
     * @param {PrivateKey} key
     * @param {DerivationScheme} derivation_scheme
     * @returns {Bip44AccountPrivate}
     */
    static new(
      key: PrivateKey,
      derivation_scheme: DerivationScheme
    ): Bip44AccountPrivate;

    /**
     * @returns {Bip44AccountPublic}
     */
    public(): Bip44AccountPublic;

    /**
     * @param {boolean} internal
     * @returns {Bip44ChainPrivate}
     */
    bip44_chain(internal: boolean): Bip44ChainPrivate;

    /**
     * @returns {PrivateKey}
     */
    key(): PrivateKey;
  }
  /**
   */
  declare export class Bip44AccountPublic {
    free(): void;

    /**
     * @param {PublicKey} key
     * @param {DerivationScheme} derivation_scheme
     * @returns {Bip44AccountPublic}
     */
    static new(
      key: PublicKey,
      derivation_scheme: DerivationScheme
    ): Bip44AccountPublic;

    /**
     * @param {boolean} internal
     * @returns {Bip44ChainPublic}
     */
    bip44_chain(internal: boolean): Bip44ChainPublic;

    /**
     * @returns {PublicKey}
     */
    key(): PublicKey;
  }
  /**
   */
  declare export class Bip44ChainPrivate {
    free(): void;

    /**
     * @param {PrivateKey} key
     * @param {DerivationScheme} derivation_scheme
     * @returns {Bip44ChainPrivate}
     */
    static new(
      key: PrivateKey,
      derivation_scheme: DerivationScheme
    ): Bip44ChainPrivate;

    /**
     * @returns {Bip44ChainPublic}
     */
    public(): Bip44ChainPublic;

    /**
     * @param {AddressKeyIndex} index
     * @returns {PrivateKey}
     */
    address_key(index: AddressKeyIndex): PrivateKey;

    /**
     * @returns {PrivateKey}
     */
    key(): PrivateKey;
  }
  /**
   */
  declare export class Bip44ChainPublic {
    free(): void;

    /**
     * @param {PublicKey} key
     * @param {DerivationScheme} derivation_scheme
     * @returns {Bip44ChainPublic}
     */
    static new(
      key: PublicKey,
      derivation_scheme: DerivationScheme
    ): Bip44ChainPublic;

    /**
     * @param {AddressKeyIndex} index
     * @returns {PublicKey}
     */
    address_key(index: AddressKeyIndex): PublicKey;

    /**
     * @returns {PublicKey}
     */
    key(): PublicKey;
  }
  /**
   * Root Private Key of a BIP44 HD Wallet
   */
  declare export class Bip44RootPrivateKey {
    free(): void;

    /**
     * @param {PrivateKey} key
     * @param {DerivationScheme} derivation_scheme
     * @returns {Bip44RootPrivateKey}
     */
    static new(
      key: PrivateKey,
      derivation_scheme: DerivationScheme
    ): Bip44RootPrivateKey;

    /**
     * recover a wallet from the given mnemonic words and the given password
     *
     * To recover an icarus wallet:
     * * 15 mnemonic words;
     * * empty password;
     * @param {Entropy} entropy
     * @param {string} password
     * @returns {Bip44RootPrivateKey}
     */
    static recover(entropy: Entropy, password: string): Bip44RootPrivateKey;

    /**
     * @param {AccountIndex} index
     * @returns {Bip44AccountPrivate}
     */
    bip44_account(index: AccountIndex): Bip44AccountPrivate;

    /**
     * @returns {PrivateKey}
     */
    key(): PrivateKey;
  }
  /**
   * setting of the blockchain
   *
   * This includes the `ProtocolMagic` a discriminant value to differentiate
   * different instances of the cardano blockchain (Mainnet, Testnet... ).
   */
  declare export class BlockchainSettings {
    free(): void;

    /**
     * serialize into a JsValue object. Allowing the client to store the settings
     * or see changes in the settings or change the settings.
     *
     * Note that this is not recommended to change the settings on the fly. Doing
     * so you might not be able to recover your funds anymore or to send new
     * transactions.
     * @returns {BlockchainSettingsType}
     */
    to_json(): BlockchainSettingsType;

    /**
     * retrieve the object from a JsValue.
     * @param {BlockchainSettingsType} value
     * @returns {BlockchainSettings}
     */
    static from_json(value: BlockchainSettingsType): BlockchainSettings;

    /**
     * default settings to work with Cardano Mainnet
     * @returns {BlockchainSettings}
     */
    static mainnet(): BlockchainSettings;
  }
  /**
   */
  declare export class Coin {
    free(): void;

    /**
     * @returns {}
     */
    constructor(): this;

    /**
     * @param {string} s
     * @returns {Coin}
     */
    static from_str(s: string): Coin;

    /**
     * @returns {string}
     */
    to_str(): string;

    /**
     * @param {number} ada
     * @param {number} lovelace
     * @returns {Coin}
     */
    static from(ada: number, lovelace: number): Coin;

    /**
     * @returns {number}
     */
    ada(): number;

    /**
     * @returns {number}
     */
    lovelace(): number;

    /**
     * @param {Coin} other
     * @returns {Coin}
     */
    add(other: Coin): Coin;
  }
  /**
   */
  declare export class CoinDiff {
    free(): void;

    /**
     * @returns {boolean}
     */
    is_zero(): boolean;

    /**
     * @returns {boolean}
     */
    is_negative(): boolean;

    /**
     * @returns {boolean}
     */
    is_positive(): boolean;

    /**
     * @returns {Coin}
     */
    value(): Coin;
  }
  /**
   */
  declare export class DaedalusAddressChecker {
    free(): void;

    /**
     * create a new address checker for the given daedalus address
     * @param {DaedalusWallet} wallet
     * @returns {DaedalusAddressChecker}
     */
    static new(wallet: DaedalusWallet): DaedalusAddressChecker;

    /**
     * check that we own the given address.
     *
     * This is only possible like this because some payload is embedded in the
     * address that only our wallet can decode. Once decoded we can retrieve
     * the associated private key.
     *
     * The return private key is the key needed to sign the transaction to unlock
     * UTxO associated to the address.
     * @param {Address} address
     * @returns {DaedalusCheckedAddress}
     */
    check_address(address: Address): DaedalusCheckedAddress;
  }
  /**
   * result value of the check_address function of the DaedalusAddressChecker.
   *
   * If the address passed to check_address was recognised by the daedalus wallet
   * then this object will contain the private key associated to this wallet
   * private key necessary to sign transactions
   */
  declare export class DaedalusCheckedAddress {
    free(): void;

    /**
     * return if the value contains the private key (i.e. the check_address
     * recognised an address).
     * @returns {boolean}
     */
    is_checked(): boolean;

    /**
     * @returns {PrivateKey}
     */
    private_key(): PrivateKey;
  }
  /**
   */
  declare export class DaedalusWallet {
    free(): void;

    /**
     * @param {PrivateKey} key
     * @returns {DaedalusWallet}
     */
    static new(key: PrivateKey): DaedalusWallet;

    /**
     * @param {Entropy} entropy
     * @returns {DaedalusWallet}
     */
    static recover(entropy: Entropy): DaedalusWallet;
  }
  /**
   * There is a special function to use when deriving Addresses. This function
   * has been revised to offer stronger properties. This is why there is a
   * V2 derivation scheme. The V1 being the legacy one still used in daedalus
   * now a days.
   *
   * It is strongly advised to use V2 as the V1 is deprecated since April 2018.
   * Its support is already provided for backward compatibility with old
   * addresses.
   */
  declare export class DerivationScheme {
    free(): void;

    /**
     * deprecated, provided here only for backward compatibility with
     * Daedalus\' addresses
     * @returns {DerivationScheme}
     */
    static v1(): DerivationScheme;

    /**
     * the recommended settings
     * @returns {DerivationScheme}
     */
    static v2(): DerivationScheme;
  }
  /**
   * the entropy associated to mnemonics. This is a bytes representation of the
   * mnemonics the user has to remember how to generate the root key of an
   * HD Wallet.
   *
   * TODO: interface to generate a new entropy
   *
   * # Security considerations
   *
   * * do not store this value without encrypting it;
   * * do not leak the mnemonics;
   * * make sure the user remembers the mnemonics string;
   */
  declare export class Entropy {
    free(): void;

    /**
     * retrieve the initial entropy of a wallet from the given
     * english mnemonics.
     * @param {string} mnemonics
     * @returns {Entropy}
     */
    static from_english_mnemonics(mnemonics: string): Entropy;

    /**
     * @returns {string}
     */
    to_english_mnemonics(): string;

    /**
     * @returns {Array<number>}
     */
    to_array(): Array<number>;
  }
  /**
   */
  declare export class InputSelectionBuilder {
    free(): void;

    /**
     * @returns {InputSelectionBuilder}
     */
    static first_match_first(): InputSelectionBuilder;

    /**
     * @returns {InputSelectionBuilder}
     */
    static largest_first(): InputSelectionBuilder;

    /**
     * @param {Coin} dust_threshold
     * @returns {InputSelectionBuilder}
     */
    static blackjack(dust_threshold: Coin): InputSelectionBuilder;

    /**
     * @param {TxInput} tx_input
     * @returns {void}
     */
    add_input(tx_input: TxInput): void;

    /**
     * @param {TxOut} output
     * @returns {void}
     */
    add_output(output: TxOut): void;

    /**
     * @param {LinearFeeAlgorithm} fee_algorithm
     * @param {OutputPolicy} output_policy
     * @returns {InputSelectionResult}
     */
    select_inputs(
      fee_algorithm: LinearFeeAlgorithm,
      output_policy: OutputPolicy
    ): InputSelectionResult;
  }
  /**
   */
  declare export class InputSelectionResult {
    free(): void;

    /**
     * @param {TxoPointer} txo_pointer
     * @returns {boolean}
     */
    is_input(txo_pointer: TxoPointer): boolean;

    /**
     * @returns {Coin}
     */
    estimated_fees(): Coin;

    /**
     * @returns {Coin}
     */
    estimated_change(): Coin;
  }
  /**
   * This is the linear fee algorithm used buy the current cardano blockchain.
   *
   * However it is possible the linear fee algorithm may change its settings:
   *
   * It is currently a function `fee(n) = a * x + b`. `a` and `b` can be
   * re-configured by a protocol update. Users of this object need to be aware
   * that it may change and that they might need to update its settings.
   */
  declare export class LinearFeeAlgorithm {
    free(): void;

    /**
     * this is the default mainnet linear fee algorithm. It is also known to work
     * with the staging network and the current testnet.
     * @returns {LinearFeeAlgorithm}
     */
    static default(): LinearFeeAlgorithm;
  }
  /**
   * This is the Output policy for automatic Input selection.
   */
  declare export class OutputPolicy {
    free(): void;

    /**
     * requires to send back all the spare changes to only one given address
     * @param {Address} address
     * @returns {OutputPolicy}
     */
    static change_to_one_address(address: Address): OutputPolicy;
  }
  /**
   * A given private key. You can use this key to sign transactions.
   *
   * # security considerations
   *
   * * do not store this key without encrypting it;
   * * if leaked anyone can _spend_ a UTxO (Unspent Transaction Output)
   *    with it;
   */
  declare export class PrivateKey {
    free(): void;

    /**
     * create a new private key from a given Entropy
     * @param {Entropy} entropy
     * @param {string} password
     * @returns {PrivateKey}
     */
    static new(entropy: Entropy, password: string): PrivateKey;

    /**
     * retrieve a private key from the given hexadecimal string
     * @param {string} hex
     * @returns {PrivateKey}
     */
    static from_hex(hex: string): PrivateKey;

    /**
     * convert the private key to an hexadecimal string
     * @returns {string}
     */
    to_hex(): string;

    /**
     * get the public key associated to this private key
     * @returns {PublicKey}
     */
    public(): PublicKey;

    /**
     * sign some bytes with this private key
     * @param {Uint8Array} data
     * @returns {Signature}
     */
    sign(data: Uint8Array): Signature;

    /**
     * derive this private key with the given index.
     *
     * # Security considerations
     *
     * * prefer the use of DerivationScheme::v2 when possible;
     * * hard derivation index cannot be soft derived with the public key
     *
     * # Hard derivation vs Soft derivation
     *
     * If you pass an index below 0x80000000 then it is a soft derivation.
     * The advantage of soft derivation is that it is possible to derive the
     * public key too. I.e. derivation the private key with a soft derivation
     * index and then retrieving the associated public key is equivalent to
     * deriving the public key associated to the parent private key.
     *
     * Hard derivation index does not allow public key derivation.
     *
     * This is why deriving the private key should not fail while deriving
     * the public key may fail (if the derivation index is invalid).
     * @param {DerivationScheme} derivation_scheme
     * @param {number} index
     * @returns {PrivateKey}
     */
    derive(derivation_scheme: DerivationScheme, index: number): PrivateKey;
  }
  /**
   */
  declare export class PrivateRedeemKey {
    free(): void;

    /**
     * retrieve the private redeeming key from the given bytes (expect 64 bytes)
     * @param {Uint8Array} bytes
     * @returns {PrivateRedeemKey}
     */
    static from_bytes(bytes: Uint8Array): PrivateRedeemKey;

    /**
     * retrieve a private key from the given hexadecimal string
     * @param {string} hex
     * @returns {PrivateRedeemKey}
     */
    static from_hex(hex: string): PrivateRedeemKey;

    /**
     * convert the private key to an hexadecimal string
     * @returns {string}
     */
    to_hex(): string;

    /**
     * get the public key associated to this private key
     * @returns {PublicRedeemKey}
     */
    public(): PublicRedeemKey;

    /**
     * sign some bytes with this private key
     * @param {Uint8Array} data
     * @returns {RedeemSignature}
     */
    sign(data: Uint8Array): RedeemSignature;
  }
  /**
   * The public key associated to a given private key.
   *
   * It is not possible to sign (and then spend) with a public key.
   * However it is possible to verify a Signature.
   *
   * # Security Consideration
   *
   * * Leaking a public key leads to privacy loss and in case of bip44 may compromise your wallet
   *   (see hardened indices for more details)
   */
  declare export class PublicKey {
    free(): void;

    /**
     * @param {string} hex
     * @returns {PublicKey}
     */
    static from_hex(hex: string): PublicKey;

    /**
     * @returns {string}
     */
    to_hex(): string;

    /**
     * @param {Uint8Array} data
     * @param {Signature} signature
     * @returns {boolean}
     */
    verify(data: Uint8Array, signature: Signature): boolean;

    /**
     * derive this public key with the given index.
     *
     * # Errors
     *
     * If the index is not a soft derivation index (< 0x80000000) then
     * calling this method will fail.
     *
     * # Security considerations
     *
     * * prefer the use of DerivationScheme::v2 when possible;
     * * hard derivation index cannot be soft derived with the public key
     *
     * # Hard derivation vs Soft derivation
     *
     * If you pass an index below 0x80000000 then it is a soft derivation.
     * The advantage of soft derivation is that it is possible to derive the
     * public key too. I.e. derivation the private key with a soft derivation
     * index and then retrieving the associated public key is equivalent to
     * deriving the public key associated to the parent private key.
     *
     * Hard derivation index does not allow public key derivation.
     *
     * This is why deriving the private key should not fail while deriving
     * the public key may fail (if the derivation index is invalid).
     * @param {DerivationScheme} derivation_scheme
     * @param {number} index
     * @returns {PublicKey}
     */
    derive(derivation_scheme: DerivationScheme, index: number): PublicKey;

    /**
     * get the bootstrap era address. I.E. this is an address without
     * stake delegation.
     * @param {BlockchainSettings} blockchain_settings
     * @returns {Address}
     */
    bootstrap_era_address(blockchain_settings: BlockchainSettings): Address;
  }
  /**
   */
  declare export class PublicRedeemKey {
    free(): void;

    /**
     * retrieve a public key from the given hexadecimal string
     * @param {string} hex
     * @returns {PublicRedeemKey}
     */
    static from_hex(hex: string): PublicRedeemKey;

    /**
     * convert the public key to an hexadecimal string
     * @returns {string}
     */
    to_hex(): string;

    /**
     * verify the signature with the given public key
     * @param {Uint8Array} data
     * @param {RedeemSignature} signature
     * @returns {boolean}
     */
    verify(data: Uint8Array, signature: RedeemSignature): boolean;

    /**
     * generate the address for this redeeming key
     * @param {BlockchainSettings} settings
     * @returns {Address}
     */
    address(settings: BlockchainSettings): Address;
  }
  /**
   */
  declare export class RedeemSignature {
    free(): void;

    /**
     * @param {string} hex
     * @returns {RedeemSignature}
     */
    static from_hex(hex: string): RedeemSignature;

    /**
     * @returns {string}
     */
    to_hex(): string;
  }
  /**
   */
  declare export class Signature {
    free(): void;

    /**
     * @param {string} hex
     * @returns {Signature}
     */
    static from_hex(hex: string): Signature;

    /**
     * @returns {string}
     */
    to_hex(): string;
  }
  /**
   * a signed transaction, ready to be sent to the network.
   */
  declare export class SignedTransaction {
    free(): void;

    /**
     * @returns {string}
     */
    id(): string;

    /**
     * @returns {SignedTransactionType}
     */
    to_json(): SignedTransactionType;

    /**
     * @param {SignedTransactionType} value
     * @returns {SignedTransaction}
     */
    static from_json(value: SignedTransactionType): SignedTransaction;

    /**
     * @param {Uint8Array} bytes
     * @returns {SignedTransaction}
     */
    static from_bytes(bytes: Uint8Array): SignedTransaction;

    /**
     * @returns {string}
     */
    to_hex(): string;
  }
  /**
   * a transaction type, this is not ready for sending to the network. It is only an
   * intermediate type to use between the transaction builder and the transaction
   * finalizer. It allows separation of concerns:
   *
   * 1. build the transaction on one side/thread/machine/...;
   * 2. sign the transaction on the other/thread/machines/cold-wallet...;
   */
  declare export class Transaction {
    free(): void;

    /**
     * @returns {TransactionId}
     */
    id(): TransactionId;

    /**
     * @returns {TransactionType}
     */
    to_json(): TransactionType;

    /**
     * @param {TransactionType} value
     * @returns {Transaction}
     */
    static from_json(value: TransactionType): Transaction;

    /**
     * @returns {Transaction}
     */
    clone(): Transaction;

    /**
     * @returns {string}
     */
    to_hex(): string;
  }
  /**
   * The transaction builder provides a set of tools to help build
   * a valid Transaction.
   */
  declare export class TransactionBuilder {
    free(): void;

    /**
     * create a new transaction builder
     * @returns {}
     */
    constructor(): this;

    /**
     * @param {TxoPointer} txo_pointer
     * @param {Coin} value
     * @returns {void}
     */
    add_input(txo_pointer: TxoPointer, value: Coin): void;

    /**
     * @returns {Coin}
     */
    get_input_total(): Coin;

    /**
     * @param {TxOut} output
     * @returns {void}
     */
    add_output(output: TxOut): void;

    /**
     * @param {LinearFeeAlgorithm} fee_algorithm
     * @param {OutputPolicy} policy
     * @returns {Array<TxOutType<string>>}
     */
    apply_output_policy(
      fee_algorithm: LinearFeeAlgorithm,
      policy: OutputPolicy
    ): Array<TxOutType<string>>;

    /**
     * @returns {Coin}
     */
    get_output_total(): Coin;

    /**
     * @param {LinearFeeAlgorithm} fee_algorithm
     * @returns {Coin}
     */
    estimate_fee(fee_algorithm: LinearFeeAlgorithm): Coin;

    /**
     * @param {LinearFeeAlgorithm} fee_algorithm
     * @returns {CoinDiff}
     */
    get_balance(fee_algorithm: LinearFeeAlgorithm): CoinDiff;

    /**
     * @returns {CoinDiff}
     */
    get_balance_without_fees(): CoinDiff;

    /**
     * @returns {Transaction}
     */
    make_transaction(): Transaction;
  }
  /**
   */
  declare export class TransactionFinalized {
    free(): void;

    /**
     * @param {Transaction} transaction
     * @returns {}
     */
    constructor(transaction: Transaction): this;

    /**
     * @returns {TransactionId}
     */
    id(): TransactionId;

    /**
     * @param {Witness} witness
     * @returns {void}
     */
    add_witness(witness: Witness): void;

    /**
     * @returns {SignedTransaction}
     */
    finalize(): SignedTransaction;
  }
  /**
   */
  declare export class TransactionId {
    free(): void;

    /**
     * @returns {string}
     */
    to_hex(): string;

    /**
     * @param {string} s
     * @returns {TransactionId}
     */
    static from_hex(s: string): TransactionId;
  }
  /**
   */
  declare export class TransactionSignature {
    free(): void;

    /**
     * @param {string} hex
     * @returns {TransactionSignature}
     */
    static from_hex(hex: string): TransactionSignature;

    /**
     * @returns {string}
     */
    to_hex(): string;
  }
  /**
   */
  declare export class TxInput {
    free(): void;

    /**
     * @param {TxoPointer} ptr
     * @param {TxOut} value
     * @returns {TxInput}
     */
    static new(ptr: TxoPointer, value: TxOut): TxInput;

    /**
     * @returns {TxInputType}
     */
    to_json(): TxInputType;

    /**
     * @param {TxInputType} value
     * @returns {TxInput}
     */
    static from_json(value: TxInputType): TxInput;
  }
  /**
   */
  declare export class TxOut {
    free(): void;

    /**
     * @param {Address} address
     * @param {Coin} value
     * @returns {TxOut}
     */
    static new(address: Address, value: Coin): TxOut;

    /**
     * serialize into a JsValue object
     * @returns {TxOutType<string>}
     */
    to_json(): TxOutType<string>;

    /**
     * retrieve the object from a JsValue.
     * @param {TxOutType<string>} value
     * @returns {TxOut}
     */
    static from_json(value: TxOutType<string>): TxOut;
  }
  /**
   */
  declare export class TxoPointer {
    free(): void;

    /**
     * @param {TransactionId} id
     * @param {number} index
     * @returns {TxoPointer}
     */
    static new(id: TransactionId, index: number): TxoPointer;

    /**
     * serialize into a JsValue object
     * @returns {TxoPointerType}
     */
    to_json(): TxoPointerType;

    /**
     * retrieve the object from a JsValue.
     * @param {TxoPointerType} value
     * @returns {TxoPointer}
     */
    static from_json(value: TxoPointerType): TxoPointer;
  }
  /**
   * sign the inputs of the transaction (i.e. unlock the funds the input are
   * referring to).
   *
   * The signature must be added one by one in the same order the inputs have
   * been added.
   */
  declare export class Witness {
    free(): void;

    /**
     * @param {BlockchainSettings} blockchain_settings
     * @param {PrivateKey} signing_key
     * @param {TransactionId} transaction_id
     * @returns {Witness}
     */
    static new_extended_key(
      blockchain_settings: BlockchainSettings,
      signing_key: PrivateKey,
      transaction_id: TransactionId
    ): Witness;

    /**
     * @param {BlockchainSettings} blockchain_settings
     * @param {PrivateRedeemKey} signing_key
     * @param {TransactionId} transaction_id
     * @returns {Witness}
     */
    static new_redeem_key(
      blockchain_settings: BlockchainSettings,
      signing_key: PrivateRedeemKey,
      transaction_id: TransactionId
    ): Witness;

    /**
     * used to add signatures created by hardware wallets where we don\'t have access
     * to the private key
     * @param {PublicKey} key
     * @param {TransactionSignature} signature
     * @returns {Witness}
     */
    static from_external(
      key: PublicKey,
      signature: TransactionSignature
    ): Witness;
  }

}

// WASM bindings don't expose the underlying type of some Rust structs
// so we expose the mourselves

declare type TransactionType = {|
  inputs: Array<TxoPointerType>,
  outputs: Array<TxOutType<number>>,
|};

declare type WitnessType = {|
  PkWitness: Array<string>,
|};
declare type SignedTransactionType = {|
  tx: TransactionType,
  witness: Array<WitnessType>,
|};

declare type TxoPointerType = {|
  id: string,
  index: number,
|};

declare type TxOutType<T> = {|
  address: string,
  value: T,
|};

declare type TxInputType = {|
  ptr: TxoPointerType,
  value: TxOutType<string>,
|};

declare type BlockchainSettingsType = {|
  protocol_magic: number
|};
